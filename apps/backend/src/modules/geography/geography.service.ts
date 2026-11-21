import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Region } from '../../database/models/region.model';
import { School } from '../../database/models/school.model';
import { University } from '../../database/models/university.model';

@Injectable()
export class GeographyService {
  constructor(
    @InjectModel(Region) private regionModel: typeof Region,
    @InjectModel(School) private schoolModel: typeof School,
    @InjectModel(University) private universityModel: typeof University,
  ) {}

  async findAll() {
    return this.regionModel.findAll({
      order: [['avgPerformanceScore', 'DESC']],
    });
  }

  async findById(id: string) {
    const region = await this.regionModel.findByPk(id);
    if (!region) {
      throw new NotFoundException(`Region with ID ${id} not found`);
    }
    const schools = await this.schoolModel.findAll({ where: { regionId: id }, limit: 10 });
    const universities = await this.universityModel.findAll({ where: { regionId: id } });
    return {
      region,
      schoolsSample: schools,
      universities,
    };
  }

  async getMapData(query?: { island?: string; institutionType?: string }) {
    const regions = await this.regionModel.findAll();
    const schools = await this.schoolModel.findAll({
      attributes: ['id', 'name', 'educationLevel', 'ownership', 'latitude', 'longitude', 'city', 'regionName', 'accreditation', 'studentCount'],
    });
    const universities = await this.universityModel.findAll({
      attributes: ['id', 'name', 'code', 'type', 'latitude', 'longitude', 'city', 'regionName', 'accreditation', 'studentCount'],
    });

    // GeoJSON FeatureCollection for Regions
    const regionFeatures = regions.map(r => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [r.longitude, r.latitude],
      },
      properties: {
        id: r.id,
        name: r.name,
        island: r.island,
        capital: r.capital,
        totalSchools: r.totalSchools,
        totalStudents: r.totalStudents,
        totalTeachers: r.totalTeachers,
        totalUniversities: r.totalUniversities,
        performanceScore: r.avgPerformanceScore,
        accreditationA: r.accreditationA,
      },
    }));

    // Institution Markers
    let markers: any[] = [];
    if (!query?.institutionType || query.institutionType === 'all' || query.institutionType === 'school') {
      markers = markers.concat(
        schools.map(s => ({
          id: s.id,
          name: s.name,
          type: 'School',
          category: s.educationLevel,
          ownership: s.ownership,
          coordinates: [s.latitude, s.longitude],
          city: s.city,
          regionName: s.regionName,
          accreditation: s.accreditation,
          studentCount: s.studentCount,
        })),
      );
    }
    if (!query?.institutionType || query.institutionType === 'all' || query.institutionType === 'university') {
      markers = markers.concat(
        universities.map(u => ({
          id: u.id,
          name: u.name,
          type: 'University',
          category: u.type,
          coordinates: [u.latitude, u.longitude],
          city: u.city,
          regionName: u.regionName,
          accreditation: u.accreditation,
          studentCount: u.studentCount,
        })),
      );
    }

    return {
      regionsGeoJson: {
        type: 'FeatureCollection',
        features: regionFeatures,
      },
      markers,
      meta: {
        totalMarkers: markers.length,
        totalRegions: regions.length,
        center: [-2.5489, 118.0149], // Indonesia geographical centroid
        zoom: 5,
      },
    };
  }
}
